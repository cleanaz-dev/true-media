interface Params {
    params: Promise<{
        contractId: string
    }>
}

export default async function Page({ params }: Params) {
    const { contractId } = await params;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4">Contract Details</h1>
            <p className="text-lg">Contract ID: {contractId}</p>
        </div>
    );
}