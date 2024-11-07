import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";

interface FormData {
  name: string;
  age: number;
}

export default function App() {
  const {
    handleSubmit: submit,
    register,
    formState: { errors },
  } = useForm<FormData>();

  const handleSubmit = submit(async (data) => {
    console.log(data);
  });

  console.log('Rendered')

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
              validate: (value) => {
                if (value.split(' ').length <= 1) {
                  return 'Insira nome e sobrenome'
                }
              }
            })}
          />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <small className="text-red-400">{message}</small>
            )}
          />
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
                message: "A idade mínima é 18 anos",
              },
              setValueAs: (value) => Number(value),
            })}
          />
          <ErrorMessage
            errors={errors}
            name="age"
            render={(message) => (
              <small className="text-red-400">{message.message}</small>
            )}
          />
        </div>

        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
