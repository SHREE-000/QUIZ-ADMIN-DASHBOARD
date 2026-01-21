import {
  // Button,
  CloseButton,
  Dialog,
  Popover,
  Portal,
} from "@chakra-ui/react"
import { useState } from "react"


export const PopoverText = () => {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <PopoverStatus open={open} />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

const PopoverStatus = ({ open }: { open: boolean }) => {
  return <div>Popover is {open ? "open" : "closed"}</div>
}
