import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    registerId: string
  }
}

export async function GET(request: Request, {params}: Params) {
  const registerId = params.registerId;
  const register = await prisma.register.findUnique({
    where: {
      id: registerId
    }
  })
  return NextResponse.json({register})
}

export async function PUT(request: NextRequest, {params}: Params) {
  const registerId = params.registerId;
  const {description, date} = await request.json()
  try {
    const register = await prisma.register.update({
      where: {
        id: registerId
      },
      data: {
        date: new Date(date),
        description
      }
    })
    return NextResponse.json(register, {status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: `Not Updated`}, {status: 400})
  }
}

// export async function DELETE(request: NextRequest, {params}: Params) {
//   const registerId = params.registerId;
//   try {
//     // const obj = await prisma.register.delete({
//     //   where: {
//     //     id: registerId
//     //   }
//     // })
//     return NextResponse.json({message: `Deleted`}, {status: 204})
//   } catch (error) {
//     console.log(error)
//     return NextResponse.json({message: `Not Deleted`}, {status: 400})
//   }
// }