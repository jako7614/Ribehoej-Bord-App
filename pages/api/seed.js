import prisma from './../../lib/prisma'

var tables = [
    { id: 1, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 2, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 3, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 4, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 5, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 6, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 7, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 8, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 9, started: false, moved: false, top: 0, left: 0, room: 1 },
    { id: 10, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 11, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 12, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 13, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 14, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 15, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 16, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 17, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 18, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 19, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 20, started: false, moved: false, top: 0, left: 0, room: 2 },
    { id: 21, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 22, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 23, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 24, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 25, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 26, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 27, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 28, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 29, started: false, moved: false, top: 0, left: 0, room: 3 },
    { id: 30, started: false, moved: false, top: 0, left: 0, room: 3 },
]

export default async function handle(req, res) {

    tables.forEach(async (table) => {
        console.log("Creating new table: ", table.id)

        await prisma.table.create({
            data: table,
        });

        console.log("Table created: ", table.id)
    })

    res.end()
}