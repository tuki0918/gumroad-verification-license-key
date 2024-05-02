import { AppError } from "@/app/_exceptions";
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
    if (err instanceof AppError) {
      return Response.json(
        { success: false, message: err.message, code: err.code },
        { status: err.status },
      );
    }
    return Response.json({ success: false, message: "Error" }, { status: 500 });
  }
};
