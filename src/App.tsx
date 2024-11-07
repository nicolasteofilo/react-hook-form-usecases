import { useForm } from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function App() {
  const { handleSubmit: submit, register } = useForm<{
    name: string;
    age: number;
  }>();

  const handleSubmit = submit(async (data) => {
    console.log(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input type="text" placeholder="Nome" {...register("name")} />
        <Input type="number" placeholder="Idade" {...register("age")} />

        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
