import { NextResponse } from "next/server"
import  prisma  from "../../lib/prisma"

export async function GET() {
  const registers = await prisma.register.findMany()
  return NextResponse.json(registers)
}

export async function POST(
  req: Request,
) {
  const {description, date} = await req.json()
  try {
    await prisma.register.create({
      data: {
        date: new Date(date),
        description
      }
    })
    return NextResponse.json({message: `Created`}, {status: 201})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: `Not Created`}, {status: 400})
  }
}

