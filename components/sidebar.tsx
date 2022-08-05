import React from 'react'
import { useRouter } from 'next/router'

interface Props { name: string }

function Sidebar({ name }: Props) {
  const navigate = useRouter();
  const handleLinks = (link: string) => {
    switch (link) {
      case "Home":
        navigate.replace("/");
        break;
      case "Trainer":
        navigate.push("/trainer");
        break;
      case "Customer":
        navigate.push("/customer");
        break;
      default:
        navigate.replace("/");
    }
  };

  return (
    <li className="relative p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer
border rounded-sm shadow-md mb-4" onClick={() => handleLinks(name)}>
      <span className="text-xl ">{name}</span>
    </li>
  )
}

export default Sidebar;