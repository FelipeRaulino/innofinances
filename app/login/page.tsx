import Image from "next/image";
import LoginForm from "./_components/login-form";

export default function Login() {
  return (
    <div className="flex flex-col relative min-h-screen items-center justify-center bg-background font-sans">
      <div className="flex flex-col bg-white w-[90%] max-w-[520px] min-h-[500px] shadow-md items-center rounded-[5px] px-6">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={164}
          height={42}
          className="w-[164px] h-[42px] mt-8"
        />

        <LoginForm />
      </div>

      <p className="text-xs absolute bottom-2 font-bold text-[#8E8E94]">
        © All Rights Reserverd. Developed by Felipe Raulino.
      </p>
    </div>
  );
}
