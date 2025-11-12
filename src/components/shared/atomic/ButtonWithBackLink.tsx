import { Button, Fieldset, Link, Stack } from "@chakra-ui/react";

const ButtonWithBackLink = ({
  label,
  helperText,
  linkText,
  link,
  onClick,
  type = 'submit',
}: {
  label: string;
  helperText: string;
  linkText: string;
  link: string;
  type?: "submit" | "button" | "reset" | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <>
      <Button type={type} onClick={onClick}>
        {label}
      </Button>
      <Fieldset.HelperText>
        {helperText}
        <Link href={link} className="link">
          {linkText}
        </Link>
      </Fieldset.HelperText>
    </>
  );
};

export default ButtonWithBackLink;
