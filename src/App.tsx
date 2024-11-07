import { useForm } from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function App() {
  const {
    handleSubmit: submit,
    register,
    formState: { errors },
  } = useForm<{
    name: string;
    age: number;
  }>();

  const handleSubmit = submit(async (data) => {
    console.log(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <Input
            type="text"
            placeholder="Nome"
            {...register("name", {
              minLength: {
                value: 2,
                message: "O nome deve ter no mínimo 2 caracteres",
              },
              required: {
                value: true,
                message: "O nome é obrigatório",
              },
            })}
          />
          {errors.name && (
            <small className="text-red-400">{errors.name.message}</small>
          )}
        </div>
        <div>
          <Input
            type="number"
            placeholder="Idade"
            {...register("age", {
              required: {
                value: true,
                message: "A idade é obrigatória",
              },
              min: {
                value: 18,
                message: 'A idade mínima é 18 anos'
              },
              setValueAs: (value) => Number(value),
            })}
          />
          {errors.age && (
            <small className="text-red-400">{errors.age.message}</small>
          )}
        </div>

        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
