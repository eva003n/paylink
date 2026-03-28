import { Button } from "../../components/ui/button";
import { Field, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";

const SignUpPage = () => {
  return (
    <section className="grid h-[80svh] place-content-center gap-4">
      <form className="w-[90%] max-w-120 grid justify-items-center gap-4">
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input id="username" />
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" />
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" />
        </Field>
        <Button className="w-full">Sign up</Button>
      </form>
    </section>
  );
};

export default SignUpPage;
