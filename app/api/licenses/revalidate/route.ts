import { CustomError } from "@/app/api/_errors";
import { execute } from "./_usecase";

export const POST = async (req: Request) => {
  try {
    const { license_key } = await req.json();
    console.log(`Revalidate license: ${license_key}`);

    await execute({
      licenseKey: license_key,
    });

    return Response.json({ success: true, message: "Success" });
  } catch (err) {
    console.log(err);
    if (err instanceof CustomError) {
      return Response.json(
        { success: false, message: err.message, code: err.code },
        { status: err.status },
      );
    }
    return Response.json({ success: false, message: "Error" }, { status: 500 });
  }
};
