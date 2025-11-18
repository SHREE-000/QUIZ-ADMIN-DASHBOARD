  import { Button, Fieldset, Link } from "@chakra-ui/react";

  const ButtonWithBackLink = ({
    label,
    helperText,
    linkText,
    link,
    onClick,
    type = "submit",
    disabled = false
  }: {
    label: string;
    helperText: string;
    linkText: string;
    link: string;
    type?: "submit" | "button" | "reset" | undefined;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
  }) => {
    return (
      <>
        <Button type={type} onClick={onClick} disabled={disabled}>
          {label}
        </Button>
        <Fieldset.HelperText>
          {helperText}
          <Link href={link} className="link" color="blue">
            {linkText}
          </Link>
        </Fieldset.HelperText>
      </>
    );
  };

  export default ButtonWithBackLink;
