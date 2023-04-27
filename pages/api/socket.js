import { DateTime } from 'luxon';
import { Server } from 'socket.io'



const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)

    
    io.on("connection", (socket) => {
        console.log("COORDINATOR CONNECTED")
        
        socket.on("tablemoved", async (data) => {
            console.log("TABLE MOVED", { 
                id: data.id,
                top: data.top,
                left: data.left 
            })
    
            await prisma.table.update({ 
                where: { id: data.id },
                data: { 
                    top: Number(data.top),
                    left: Number(data.left),
                    started: data.started,
                    moved: data.moved
                }
            })
    
            var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
            io.emit("rerender", tables)
        })
    
        socket.on("tablereset", async (data) => {
            console.log("TABLE RESET")
    
            var tablesToBeReset = await prisma.table.findMany({ where: { room: Number(data.rid) }})
    
            var offset = 0;
    
            await asyncForEach(tablesToBeReset, async table => {
                await prisma.table.update({
                    where: { 
                        id: table.id
                    },
                    data: {
                        top: 100 + offset, 
                        left: 50,
                        moved: false,
                        started: false,
                        dishes: {
                            deleteMany: {}
                        },
                        guests: {
                            deleteMany: {}
                        },
                        note: null,
                        prepared: false
                    }
                })
    
                offset += 70;
            })
            
            var tables = await prisma.table.findMany({ include: { guests: true, dishes: true, dishes: true }})
            io.emit("rerender", tables)
        
            io.emit("resetobserver", {
                prepared: tables.filter(x => x.prepared == true && x.started == false),
                awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                active: tables.filter(x => x.dishes.some(y => y.state == 2 && x.started)), 
                ready: tables.filter(x => x.dishes.some(y => y.state == 3 && x.started))
            })
        })
    
        socket.on("loadpreset", async (data) => {
            var preset = await prisma.preset.findFirst({ 
                where: { number: Number(data.presetnumber), room: Number(data.room) }
            })
            if (preset.content == null) {
                io.emit("nopreset")
            } else {
                await asyncForEach(preset.content, async table => {            
                    await prisma.table.update({
                        where: {
                            id: table.id
                        },
                        data: { 
                            top: Number(table.top),
                            left: Number(table.left),
                            moved: table.moved,
                        }
                    })
                });
        
                var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
                io.emit("rerender", tables)  
                io.emit("presetloaded")
                console.log("PRESET LOADED", data.presetnumber)
            }
          
        })
    
        socket.on("savepreset", async (data) => {
            console.log("PRESET SAVED", data.presetnumber)

            var presets = await prisma.preset.findMany();

            var preset = presets.find(x => x.room == data.room && x.number == data.presetnumber)
    
            await prisma.preset.update({
                where: { 
                    id: preset.id
                },
                data: { content: data.setup },
            })
        })
    
        socket.on("tablestarted", async (data) => {
            console.log("TABLE STARTED", data.table.id)
    
            console.log("DISHNUMBER", data.dishNumber)
            
            console.log("NOTE:", data.textArea) 
    
            await prisma.table.update({
                where: {
                    id: data.table.id
                },
                data: {
                    started: true,
                    updatedAt: new Date()
                },
            })       

            var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
            io.emit("rerender", tables)
    
            io.emit("tablestartedobserver", {
                prepared: tables.filter(x => x.prepared == true && x.started == false),
                awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                active: tables.filter(x => x.dishes.some(y => y.state == 2 && x.started)), 
                ready: tables.filter(x => x.dishes.some(y => y.state == 3 && x.started))
            })
        })

        socket.on("tableprepared", async (data) => {
            console.log("TABLE PREPARED", data.table.id)
    
            console.log("DISHNUMBER", data.dishNumber)
            
            console.log("NOTE:", data.textArea)

            console.log(data)
    
            if (data.table.prepared == true) {
                await prisma.table.update({
                    where: { 
                        id: data.table.id
                    },
                    data: {
                        dishes: {
                            deleteMany: {}
                        },
                        guests: {
                            deleteMany: {}
                        }
                    }
                })
            }

            var dishes = [{
                state: 1
            }];
    
            for (let i = 1; i < data.dishNumber; i++) {
                dishes.push({
                    state: 0
                })      
            }
    
            var notAllergicGuests = []
    
            for (let j = data.guests.length; j <= data.guestNumber - 1; j++) {
                notAllergicGuests.push({
                    nuts: false,
                    lactose: false,
                    gluten: false,
                    shell: false
                })            
            }        
    
            await prisma.table.update({
                where: {
                    id: data.table.id
                },
                data: {
                    dishes: {
                        create: dishes
                    },
                    started: false,
                    guests: {
                        create: data.guests.concat(notAllergicGuests)
                    },
                    note: data.textArea != "" ? data.textArea : null,
                    prepared: true
                },
            })
    
                

            var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
                io.emit("rerender", tables)
    
                io.emit("tablestartedobserver", {
                    prepared: tables.filter(x => x.prepared == true && x.started == false),
                    awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                    active: tables.filter(x => x.dishes.some(y => y.state == 2  && x.started)), 
                    ready: tables.filter(x => x.dishes.some(y => y.state == 3  && x.started))
                })
            
        })
    
        socket.on("advancetable", async (data) => {
            console.log("TABLE ADVANCED", data.id)
    
            var before = data.dishes
            
            // .map((el) => {
            //     if (el.TableId) {
            //         delete el.TableId
            //     }
            //     return el
            // })
    
            console.log("BEFORE: ", before)
    
            var current = before.find(x => x.state !== 4)
            var currentIndex = before.indexOf(current)
            before[currentIndex].state += 1;
            var changed = before[currentIndex];
            
            console.log("AFTER: ", before)
            
            await prisma.table.update({
                where: {
                    id: data.id
                },
                data: {
                    dishes: {
                        update: {
                            where: {
                                id: changed.id
                            },
                            data: {
                                state: changed.state
                            }
                        }                        
                    },
                    updatedAt: new Date()          
                    
                }
            })
    
            var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
            io.emit("rerender", tables)
         
            io.emit("tableadvancedobserver", {
                prepared: tables.filter(x => x.prepared == true && x.started == false),
                awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                active: tables.filter(x => x.dishes.some(y => y.state == 2  && x.started)), 
                ready: tables.filter(x => x.dishes.some(y => y.state == 3  && x.started))
            })
        })

        socket.on("deadvancetable", async (data) => {
            console.log("TABLE DEADVANCED", data.id)
            var before = data.dishes

            var states = []
            for(var i = 0; i < data.dishes.length; i++){
                states.push(data.dishes[i].state)
            }

            if (states[0] == 1 && states[1] == 0){
                console.log("Reset table here")
                console.log("TABLE ENDED", data.id)
    
                await prisma.table.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        dishes: {
                            deleteMany: {}
                        },
                        started: false,
                        note: null,
                    }
                })
        
                await prisma.guest.deleteMany({
                    where: {
                        tableId: data.id
                    }
                })
        
                var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
                io.emit("rerender", tables)
                io.emit("tableadvancedobserver", {
                    prepared: tables.filter(x => x.prepared == true && x.started == false),
                    awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                    active: tables.filter(x => x.dishes.some(y => y.state == 2  && x.started)), 
                    ready: tables.filter(x => x.dishes.some(y => y.state == 3  && x.started))
                })
            }
            else {
            
                // .map((el) => {
                //     if (el.TableId) {
                //         delete el.TableId
                //     }
                //     return el
                // })
        
                console.log("BEFORE: ", before)
        
                var current = before.find(x => x.state !== 4 && x.state > 0)
                if (!current) {
                    current = before.findLast(x => x.state === 4)
                }
                var currentIndex = before.indexOf(current)
                before[currentIndex].state -= 1;
                var changed = before[currentIndex];
                
                console.log("AFTER: ", before)
                
                await prisma.table.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        dishes: {
                            update: {
                                where: {
                                    id: changed.id
                                },
                                data: {
                                    state: changed.state
                                }
                            }                        
                        },
                        updatedAt: new Date()
                        
                    }
                })
        
                var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
                io.emit("rerender", tables)
             
                io.emit("tableadvancedobserver", {
                    prepared: tables.filter(x => x.prepared == true && x.started == false),
                    awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                    active: tables.filter(x => x.dishes.some(y => y.state == 2  && x.started)), 
                    ready: tables.filter(x => x.dishes.some(y => y.state == 3  && x.started))
                })
            }


            
        })
    
        socket.on("endtable", async (data) => {
            console.log("TABLE ENDED", data.id)
    
            await prisma.table.update({
                where: {
                    id: data.id
                },
                data: {
                    dishes: {
                        deleteMany: {}
                    },
                    started: false,
                    note: null,
                    prepared: false
                }
            })
    
            await prisma.guest.deleteMany({
                where: {
                    tableId: data.id
                }
            })
    
            var tables = await prisma.table.findMany({ include: { guests: true, dishes: true }})
            io.emit("rerender", tables)    
        })

        socket.on("resetsingletable", async (data) => {
            console.log("TABLE RESET")
    
            var tableToBeReset = await prisma.table.findFirst({ where: { id: Number(data.id) }, include: { guests: true, dishes: true }})
            var tables = await prisma.table.findMany({ where: { room: Number(tableToBeReset.room) }, include: { guests: true, dishes: true }})

            var index = tables.findIndex(x => x.id == tableToBeReset.id)

            var offset = index * 70
    
            await prisma.table.update({
                where: { 
                    id: tableToBeReset.id
                },
                data: {
                    moved: false,
                    started: false,
                    top: 100 + offset, 
                    left: 50,
                    dishes: {
                        deleteMany: {}
                    },
                    guests: {
                        deleteMany: {}
                    },
                    note: null,
                    prepared: false
                }
            })

            
            tables = await prisma.table.findMany({ include: { guests: true, dishes: true, dishes: true }})
            io.emit("rerender", tables)
        
            io.emit("resetobserver", {
                prepared: tables.filter(x => x.prepared == true && x.started == false),
                awaiting: tables.filter(x => x.dishes.some(y => y.state == 1 && x.started)),
                active: tables.filter(x => x.dishes.some(y => y.state == 2  && x.started)), 
                ready: tables.filter(x => x.dishes.some(y => y.state == 3  && x.started))
            })
        })
    })

    
    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
