//api/webhooks/system-task/[systemTaskId]

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskType } from "@/lib/generated/prisma/client";
import { handleGenerateContractPdf } from "@/lib/handlers/handle-generate-contract";
import { handleResearchContent } from "@/lib/handlers/handle-research-content";
import { handlePersonalizePdf } from "@/lib/handlers/handle-peronalize-pdf";
import { handleSignedContract } from "@/lib/handlers/handle-sgined-contract";

interface Params {
    params: Promise<{
        systemTaskId: string;
    }>;
}

export async function POST(request: Request, { params }: Params) {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    const authHeader = request.headers.get("x-webhook-secret");

    if (!authHeader || authHeader !== webhookSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { systemTaskId } = await params;

    const data = await request.json();

    const systemTask = await prisma.systemTask.findUnique({
        where: { id: systemTaskId },
    });

    if (!systemTask) {
        return NextResponse.json(
            { error: "System task not found" },
            { status: 404 }
        );
    }

    try {
        switch (systemTask.type) {
            case TaskType.GENERATE_CONTRACT_PDF:
                await handleGenerateContractPdf(systemTask, data);
                break;

            case TaskType.RESEARCH_CONTENT:
                await handleResearchContent(systemTask, data);
                break;

            case TaskType.OTHER:
                await handleOther(systemTask, data);
                break;
            case TaskType.UPDATING_CONTRACT_PDF:
                console.log("Pending...")
                break
            case TaskType.PERSONALIZE_SIGNER_PDF:
                await handlePersonalizePdf(systemTask,data)
                break
             case TaskType.SEAL_CONTRACT:
                await handleSignedContract(systemTask,data)
                break

            default:
                const _exhaustive: never = systemTask.type;
                throw new Error(`Unhandled task type: ${_exhaustive}`);
        }

        await prisma.systemTask.update({
            where: { id: systemTaskId },
            data: { status: "COMPLETED" },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        await prisma.systemTask.update({
            where: { id: systemTaskId },
            data: {
                status: "FAILED",
                error: err instanceof Error ? err.message : "Unknown error",
            },
        });

        return NextResponse.json(
            { error: "Task failed" },
            { status: 500 }
        );
    }
}




async function handleOther(
    systemTask: { id: string; metadata: unknown },
    data: unknown
) {
    // TODO: implement
}