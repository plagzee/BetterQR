import { NextResponse } from "next/server";

export async function POST(request) {

    try {

        const data = await request.json();
        const { adminPass } = data;

        // Simple authentication check
        if (adminPass === process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ success: true, message: "Access granted" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
        }

    } catch (error) {
        console.log("Error in auth route:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }

}