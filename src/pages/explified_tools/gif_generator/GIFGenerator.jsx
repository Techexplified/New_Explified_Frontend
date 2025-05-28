import {
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { Settings2Icon } from "lucide-react";
import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../network/axiosInstance'

const styles = ["Cartoon", "Realistic", "Pixel Art", "Watercolor"];
const quality = ["Low", "Medium", "High", "Ultra"];
const colors = ["Colorful", "Monochrome", "Pastel", "Neon"];
const artOf = ["Van Gogh", "Picasso", "Studio Ghibli", "Cyberpunk"];
const moods = ["Happy", "Dark", "Whimsical", "Chill"];

const GIFGenerator = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const [gif ,setGif] = useState(null);
  const [loading ,setLoading] = useState(false);
  const [prompt ,setPrompt] = useState("");

  const handleGenerateGif = async()=>{
    try {
       setGif(null);
       setLoading(true);
        const data = {
          prompt
        }
        const res = await axiosInstance.post("api/textToGif",data);
        console.log(res.data.data.images.original.url);
        setGif(res.data.data.images.original.url);
        setLoading(false);
    } catch (error) {
        console.log(error);
    }
  }
  const handlePromptChange = (e)=>{
    // console.log(e.target.value);
    setPrompt(e.target.value);
  }
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {/* <div className="w-full h-10 absolute top-0 p-4 ">
        <Tooltip content="Back">
          <button
            className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack />
          </button>
        </Tooltip>
      </div> */}
      <div className="text-8xl font-englebert font-bold mb-12">
        GIF Generator
      </div>
      <div className="flex flex-row gap-5">
        {/* Textarea + Button */}
        <div className="relative w-[50rem]">
          <Textarea
            isClearable
            placeholder="Prompt example: A superhero bunny flying through the sky"
            minRows={8}
            classNames={{
              base: "w-full",
            }}
            value={prompt}
            onChange={handlePromptChange}
          />
          <div className="absolute bottom-6 right-6">
            <Button
              size="sm"
              color="secondary"
              className="rounded-md text-sm flex items-center justify-center font-light font-pacifico"
            onClick={handleGenerateGif} >
              <RiAiGenerate className="mr-1" /> <span>Generate GIF</span>
            </Button>
          </div>
        </div>

        {/* Settings Button */}
        <div
          onClick={onOpen}
          className="flex flex-row justify-center items-center w-12 h-12 border-1 rounded-full p-3 cursor-pointer hover:bg-slate-300/25"
        >
          <Settings2Icon />
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg">
                AI Customize Settings
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Select label="Select Style" variant="bordered" radius="sm">
                  {styles.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>

                <Select label="Select Quality" variant="bordered" radius="sm">
                  {quality.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Select Color Scheme"
                  variant="bordered"
                  radius="sm"
                >
                  {colors.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Select an Art Style of"
                  variant="bordered"
                  radius="sm"
                >
                  {artOf.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>

                <Select label="Select Mood" variant="bordered" radius="sm">
                  {moods.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onClose}>
                  Apply Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="w-full flex justify-center p-10">
        {loading && (<div className="flex justify-center">
         <Spinner/>
        </div>)}
        {gif && (
          <img src={gif} alt="" />
        )}
      </div>

    </div>
  );
};

export default GIFGenerator;
