import { Fieldset, Link } from "@chakra-ui/react";

const BackwardLink = ({
  label,
  linkText,
  link,
}: {
  label: string;
  linkText: string;
  link: string;
}) => {
  return (
    <Fieldset.HelperText>
      {label}
      {"  "}
      <Link href={link} color="blue" className="link">
        {linkText}
      </Link>
    </Fieldset.HelperText>
  );
};

export default BackwardLink;
