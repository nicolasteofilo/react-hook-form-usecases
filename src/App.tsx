import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";

interface IFormData {
  name: string;
  age: number;
  zipcode: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
}

interface Address {
  cep: string;
  logradouro: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
}

export default function App() {
  console.log("App rendered");

  const {
    handleSubmit: submit,
    register,
    formState: { errors, dirtyFields, isSubmitting, isValid },
    clearErrors,
    reset,
    setFocus,
    getValues,
    watch,
    setValue,
  } = useForm<IFormData>({});

  const lastSearchedZipcode = useRef<string>(getValues('zipcode'));

  // isDirty is true if form as changed

  useEffect(() => {    
    const { unsubscribe } = watch(async (formData) => {
      const zipcode = formData?.zipcode ?? '';

      if (zipcode.length === 8 && zipcode !== lastSearchedZipcode.current) {
        const response = await fetch(
          `https://viacep.com.br/ws/${formData.zipcode}/json/`
        );
        const data = (await response.json()) as Address;

        lastSearchedZipcode.current = zipcode;
        setValue("city", data.localidade);
        setValue("neighborhood", data.bairro);
        setValue("street", data.logradouro);
        setValue("state", data.estado);

      }
    }); // watch receiver a function, this function is listener

    return () => {
      unsubscribe();
    };
  }, [watch, setValue]);

  const handleSubmit = submit(async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    reset({
      age: data.age,
      name: data.name,
    }); // the values passed in reset will be new defaultValues
  });

  const formIsDirty = Object.keys(dirtyFields).length > 0;

  useEffect(() => {
    const keyOfError = Object.keys(errors)[0] as keyof IFormData;
    setFocus(keyOfError);
  }, [errors, setFocus]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 max-w-[300px] w-full"
      >
        <div>
          <Input
            className="autofill:bg-transparent"
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
                if (value.split(" ").length <= 1) {
                  return "Insira nome e sobrenome";
                }
              },
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

        <div className="">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              type="text"
              placeholder="CEP"
              {...register("zipcode", {
                required: {
                  value: true,
                  message: "O CEP é obrigatória",
                },
              })}
            />
          </div>
          <div>
            <ErrorMessage
              errors={errors}
              name="zipcode"
              render={(message) => (
                <small className="text-red-400">{message.message}</small>
              )}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Input
              className="flex-1"
              type="text"
              placeholder="Estado"
              {...register("state", {
                required: {
                  value: true,
                  message: "O estado é obrigatório",
                },
              })}
            />
            <Input
              className="flex-1"
              type="text"
              placeholder="Cidade"
              {...register("city", {
                required: {
                  value: true,
                  message: "A cidade é obrigatória",
                },
              })}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              className="flex-1"
              type="text"
              placeholder="Bairro"
              {...register("neighborhood", {
                required: {
                  value: true,
                  message: "O bairro é obrigatório",
                },
              })}
            />
            <Input
              className="flex-1"
              type="text"
              placeholder="Rua"
              {...register("street", {
                required: {
                  value: true,
                  message: "A rua é obrigatória",
                },
              })}
            />
          </div>
        </div>

        <div className="flex mt-4 gap-2 w-full">
          <Button
            type="submit"
            className="flex-1"
            disabled={!formIsDirty || isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={formIsDirty || isSubmitting || !isValid}
          >
            {isSubmitting ? "Salvando..." : "Enviar"}
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => clearErrors()}
        >
          Limpar campos
        </Button>
      </form>
    </div>
  );
}
