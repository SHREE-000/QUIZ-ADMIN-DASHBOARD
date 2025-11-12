"use client";

import {
  Button,
  Field,
  Fieldset,
  FileUpload,
  Float,
  Input,
  Span,
  Stack,
  TagsInput,
  Textarea,
  useFileUploadContext,
  HStack,
  Image,
  Box,
  Popover,
  Portal,
  Group,
  Text,
  VStack,
  Flex,
  Heading,
  SimpleGrid,
  For,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import "../../../style.css";
import axios, { AxiosError } from "axios";
import { LuArrowRight, LuFileImage, LuFileUp, LuX } from "react-icons/lu";
import { useParams, useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { Tooltip } from "@/src/components/ui/tooltip";
import { MdEditOff, MdOutlineClose } from "react-icons/md";
import { useColorModeValue } from "@/src/components/ui/color-mode";
import { FiFileText } from "react-icons/fi";
import { toaster } from "@/src/components/ui/toaster";
import CustomCard from "@/src/components/dashboard/Card";

const FileUploadList = () => {
  const fileUpload = useFileUploadContext();
  const files = fileUpload.acceptedFiles;
  if (files.length === 0) return null;

  return (
    <FileUpload.ItemGroup>
      <HStack gap={6} wrap="wrap">
        {files.map((file) => (
          <FileUpload.Item
            w="auto"
            boxSize="20"
            p="2"
            file={file}
            key={file.name}
          >
            <FileUpload.ItemPreviewImage />
            <Float placement="top-end">
              <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </HStack>
    </FileUpload.ItemGroup>
  );
};

export default function StreamViewPage() {
  type Subject = {
    _id: string;
    stream: string;
    subject: string;
    description: string;
    videoContent: string[];
    imageContent: string[];
    pdfContent: string[];
  };

  const [stream, setStream] = useState("");
  const [subject, setSubject] = useState<Subject[]>([]);
  const [updatedStream, setUpdatedStream] = useState("");
  const [description, setDescription] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [img, setImg] = useState<string[]>([]);
  const [pdf, setPdf] = useState<string[]>([]);
  const [removedImg, setRemovedImg] = useState<string[]>([]);
  const [removedPdf, setRemovedPdf] = useState<string[]>([]);
  const [removedVideoLinks, setRemovedVideoLinks] = useState<string[]>([]);
  const [newVideoLinks, setNewVideoLinks] = useState<string[]>([]);
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [uploadedPdf, setUploadedPdf] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const ref = useRef<HTMLButtonElement | null>(null);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchSubjectByStream = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/subject/stream?id=${id}`
      );
      const data = response.data;
      setSubject(data);
    };
    const fetchStream = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/stream/${id}`
      );
      const data = response.data;
      setStream(data.stream);
      setDescription(data.description || "");
      setRemovedVideoLinks(data.videoContent || []);
      setVideoLinks(data.videoContent || []);
      setImg(data.imageContent);
      setPdf(data.pdfContent);
    };
    try {
      fetchStream();
      fetchSubjectByStream();
    } catch (error: unknown) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while fetch the the stream.",
      });
    }
  }, [id]);

  const handleChangeImg = (files: FileList | null) => {
    setUploadedImg(Array.from(files ?? []));
  };

  const handleChangePdf = (files: FileList | null) => {
    setUploadedPdf(Array.from(files ?? []));
  };

  const handleRemovePdf = (fileName: string) => {
    setRemovedPdf((prev) => [...prev, fileName]);
    setPdf((prev) => prev.filter((f) => f !== fileName));
  };

  const handleRemoveImg = (fileName: string) => {
    setRemovedImg((prev) => [...prev, fileName]);
    setImg((prev) => prev.filter((f) => f !== fileName));
  };

  const handleUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("updatedStream", updatedStream);
    if (!stream.trim()) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Stream name is required.",
      });
      return;
    }
    formData.append("updatedDescription", updatedDescription);
    formData.append("newVideo", newVideoLinks.join(","));
    formData.append("removedImg", removedImg.join(","));
    formData.append("removedPdf", removedPdf.join(","));
    formData.append("removedVideo", removedVideoLinks.join(","));
    // Append newly uploaded files
    // Filter out duplicates
    [
      ...new Map(
        Array.from(uploadedImg).map((item) => [item.name, item])
      ).values(),
    ].forEach((file) => {
      formData.append("img", file);
    });

    [
      ...new Map(
        Array.from(uploadedPdf).map((item) => [item.name, item])
      ).values(),
    ].forEach((file) => {
      formData.append("pdf", file);
    });
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/stream/${id}`,
        formData
      );

      if (response.status === 201) {
        toaster.create({
          type: "success",
          title: "Success!",
          description: "Stream updated successfully.",
        });
        setUpdatedStream("");
        setUpdatedDescription("");
        setNewVideoLinks([]);
        setRemovedImg([]);
        setRemovedPdf([]);
        setRemovedVideoLinks([]);
      } else {
        toaster.create({
          type: "error",
          title: "Failed!",
          description: "An error occurred while updating the stream.",
        });
      }
      router.replace("");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const resErr =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An error occurred while updating the stream.";
      toaster.create({
        type: "error",
        title: "Failed!",
        description: resErr || "An error occurred while updating the stream.",
      });
    }
  };

  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack
      gap={6}
      h="auto"
      boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
    >
      <Stack align="center" p={4}>
        <Fieldset.Root size="lg" maxW="md">
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Stack>
              <Fieldset.Legend>View and Edit Stream</Fieldset.Legend>
              <Fieldset.HelperText>
                Fill in the details below to edit the stream.
              </Fieldset.HelperText>
            </Stack>
            {isEditMode ? (
              <Tooltip content="Disable edit mode">
                <FaEdit
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            ) : (
              <Tooltip content="Enable edit mode">
                <MdEditOff
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          </Stack>

          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Stream</Field.Label>
              <Input
                value={stream}
                disabled={!isEditMode}
                onChange={(e) => {
                  setStream(e.target.value);
                  setUpdatedStream(() => {
                    if (stream !== e.target.value) return e.target.value;
                    return "";
                  });
                }}
                name="stream"
                type="text"
                placeholder="Enter stream name"
                required
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={description}
                disabled={!isEditMode}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setUpdatedDescription(() => {
                    if (description !== e.target.value) return e.target.value;
                    return "";
                  });
                }}
                name="description"
                placeholder="Enter stream description"
              />
            </Field.Root>

            <Field.Root>
              <TagsInput.Root
                value={videoLinks}
                disabled={!isEditMode}
                onValueChange={(newTags) => {
                  setRemovedVideoLinks((prev) =>
                    prev.filter((item) => !newTags.value.includes(item))
                  );
                  setVideoLinks(newTags.value);
                }}
              >
                <TagsInput.Label>
                  Remove Existing Youtube Video Links
                </TagsInput.Label>
                <TagsInput.Control>
                  <TagsInput.Items />
                </TagsInput.Control>
              </TagsInput.Root>
            </Field.Root>

            <Field.Root>
              <TagsInput.Root
                value={newVideoLinks}
                disabled={!isEditMode}
                onValueChange={(newTags) => setNewVideoLinks(newTags.value)}
              >
                <TagsInput.Label>Add New Youtube Video Links</TagsInput.Label>
                <TagsInput.Control>
                  {isEditMode ? (
                    <Tooltip content="Remove Youtube video link">
                      <TagsInput.Items />
                    </Tooltip>
                  ) : (
                    <TagsInput.Items style={{ cursor: "not-allowed" }} />
                  )}
                  <TagsInput.Input
                    style={{ cursor: isEditMode ? "text" : "not-allowed" }}
                    placeholder="Add Youtube video link..."
                  />
                </TagsInput.Control>
                <Span textStyle="xs" color="fg.muted" ms="auto">
                  Press Enter or Return to add Youtube Video Links
                </Span>
              </TagsInput.Root>
            </Field.Root>

            <Field.Root>
              <Field.Label>Remove Images</Field.Label>
              {img && typeof img[0] === "string" && (
                <Stack direction="row" gap={4} wrap="wrap">
                  {img.map((imgUrl, idx) => (
                    <Box
                      key={idx}
                      position="relative"
                      display="inline-block"
                      m={2}
                      w="160px"
                      h="160px"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Uploaded image ${idx + 1}`}
                        rounded="md"
                        boxSize="160px"
                        objectFit="cover"
                      />
                      <Popover.Root positioning={{ placement: "bottom-end" }}>
                        <Popover.Trigger asChild>
                          <Button
                            disabled={!isEditMode}
                            size="xs"
                            colorScheme="red"
                            position="absolute"
                            top="2px"
                            right="2px"
                            aria-label="Remove image"
                            rounded="full"
                            bg="yellow.100"
                            _hover={{ bg: "red.100" }}
                          >
                            {isEditMode ? (
                              <Tooltip content="Remove image">
                                <MdOutlineClose color="black" />
                              </Tooltip>
                            ) : (
                              <MdOutlineClose color="grey" />
                            )}
                          </Button>
                        </Popover.Trigger>
                        <Portal>
                          <Popover.Positioner>
                            <Popover.Content>
                              <Popover.Arrow />
                              <Popover.Body>
                                Are you sure you want to remove{" "}
                                <Text fontWeight="bold">
                                  {
                                    imgUrl.split("/")[
                                      imgUrl.split("/").length - 1
                                    ]
                                  }
                                </Text>{" "}
                                image?
                              </Popover.Body>
                              <Popover.Footer>
                                <Group
                                  flex="1"
                                  justifyContent="flex-end"
                                  gap="2"
                                >
                                  <Popover.CloseTrigger asChild>
                                    <Button size="sm" ref={ref}>
                                      Cancel
                                    </Button>
                                  </Popover.CloseTrigger>
                                  <Popover.CloseTrigger asChild>
                                    <Button
                                      size="sm"
                                      onClick={() => handleRemoveImg(imgUrl)}
                                    >
                                      Remove
                                    </Button>
                                  </Popover.CloseTrigger>
                                </Group>
                              </Popover.Footer>
                              <Popover.CloseTrigger />
                            </Popover.Content>
                          </Popover.Positioner>
                        </Portal>
                      </Popover.Root>
                    </Box>
                  ))}
                </Stack>
              )}
              {pdf.length === 0 && (
                <Box textAlign="center" color="gray.500" py={2}>
                  No Image files uploaded
                </Box>
              )}
            </Field.Root>

            <Field.Root>
              <Field.Label>Remove PDF</Field.Label>
              <VStack align="stretch" gap={2} mt={4}>
                {pdf.map((file) => (
                  <Flex
                    key={file}
                    align="center"
                    justify="space-between"
                    p={2}
                    borderWidth="1px"
                    borderColor={border}
                    rounded="md"
                    bg={bg}
                    _hover={{ bg }}
                  >
                    <Flex align="center" justify="space-between" gap={2}>
                      <Box color="blue.500">
                        <FiFileText />
                      </Box>
                      <Text fontSize="sm">
                        {file.split("/")[file.split("/").length - 1]}
                      </Text>
                      <Popover.Root initialFocusEl={() => ref.current}>
                        <Popover.Trigger asChild>
                          <Button
                            disabled={!isEditMode}
                            size="xs"
                            colorScheme="red"
                            alignItems="right"
                            top="2px"
                            right="2px"
                            aria-label="Remove PDF"
                            rounded="full"
                            bg="yellow.100"
                            _hover={{ bg: "red.100" }}
                          >
                            {isEditMode ? (
                              <Tooltip content="Remove PDF">
                                <MdOutlineClose color="black" />
                              </Tooltip>
                            ) : (
                              <MdOutlineClose color="grey" />
                            )}
                          </Button>
                        </Popover.Trigger>
                        <Portal>
                          <Popover.Positioner>
                            <Popover.Content>
                              <Popover.Arrow />
                              <Popover.Body>
                                Are you sure you want to remove{" "}
                                <Text fontWeight="bold">
                                  {file.split("/")[file.split("/").length - 1]}
                                </Text>{" "}
                                PDF?
                              </Popover.Body>
                              <Popover.Footer>
                                <Group
                                  flex="1"
                                  justifyContent="flex-end"
                                  gap="2"
                                >
                                  <Popover.CloseTrigger asChild>
                                    <Button size="sm" ref={ref}>
                                      Cancel
                                    </Button>
                                  </Popover.CloseTrigger>
                                  <Popover.CloseTrigger asChild>
                                    <Button
                                      size="sm"
                                      onClick={() => handleRemovePdf(file)}
                                    >
                                      Remove
                                    </Button>
                                  </Popover.CloseTrigger>
                                </Group>
                              </Popover.Footer>
                              <Popover.CloseTrigger />
                            </Popover.Content>
                          </Popover.Positioner>
                        </Portal>
                      </Popover.Root>
                    </Flex>
                  </Flex>
                ))}

                {pdf.length === 0 && (
                  <Box textAlign="center" color="gray.500" py={2}>
                    No PDF files uploaded
                  </Box>
                )}
              </VStack>
            </Field.Root>

            <Field.Root>
              <FileUpload.Root
                accept="image/*"
                maxFiles={25}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  event.preventDefault();
                  handleChangeImg(event.target.files);
                }}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Trigger asChild>
                  <Button variant="outline" size="sm" w="100%">
                    <LuFileImage /> Upload Images
                  </Button>
                </FileUpload.Trigger>
                <FileUploadList />
              </FileUpload.Root>
            </Field.Root>

            <Field.Root>
              <FileUpload.Root
                accept="application/pdf"
                maxFiles={25}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  event.preventDefault();
                  handleChangePdf(event.target.files);
                }}
              >
                <FileUpload.HiddenInput />
                <FileUpload.Trigger asChild>
                  <Button variant="outline" size="sm" w="100%">
                    <LuFileUp /> Upload PDF
                  </Button>
                </FileUpload.Trigger>
                <FileUpload.List showSize clearable />
              </FileUpload.Root>
            </Field.Root>
          </Fieldset.Content>

          <Popover.Root initialFocusEl={() => ref.current}>
            <Popover.Trigger asChild>
              <Button disabled={!isEditMode}>Edit Stream</Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.Arrow />
                  <Popover.Body>Are you sure you want to edit?</Popover.Body>
                  <Popover.Footer>
                    <Group flex="1" justifyContent="flex-end" gap="2">
                      <Popover.CloseTrigger asChild>
                        <Button size="sm" ref={ref}>
                          Cancel
                        </Button>
                      </Popover.CloseTrigger>
                      <Popover.CloseTrigger asChild>
                        <Button size="sm" type="submit" onClick={handleUpdate}>
                          Edit
                        </Button>
                      </Popover.CloseTrigger>
                    </Group>
                  </Popover.Footer>
                  <Popover.CloseTrigger />
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
          <Fieldset.HelperText>
            Don&apos;t need an account?{" "}
            <Link href="/dashboard" className="link">
              Back to Dashboard
            </Link>
          </Fieldset.HelperText>
        </Fieldset.Root>
      </Stack>
      <Stack align="center" p={4} gap={6}>
        <Heading>Subjects Under the {stream}</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} p={4}>
          {subject.map(
            (
              data: {
                _id: string;
                stream: string;
                subject: string;
                description: string;
                videoContent: string[];
                imageContent: string[];
                pdfContent: string[];
              },
              idx: number
            ) => (
              <CustomCard
                data={data}
                category={"subject"}
                idx={idx}
                key={data._id}
              />
            )
          )}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
