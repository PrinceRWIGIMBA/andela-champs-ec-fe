import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoCartOutline, IoPersonOutline } from "react-icons/io5";
import { FaChartLine } from "react-icons/fa6";
import { IconType } from "react-icons";
import { useSearchParams } from "next/navigation";
import product from '../../public/product.svg'
import { useRouter } from "next/navigation";

interface MenuInterface {
  title: string;
  src: IconType;
  gap?: boolean;
  clicked: boolean;
}

const Menus: MenuInterface[] = [
  { title: "Dashboard", src: MdDashboard, clicked: true },
  { title: "Users", src: IoPersonOutline, clicked: false },
  { title:"Products", src: IoCartOutline, clicked: false },
  { title:"Chart", src: FaChartLine, clicked: false}
];

function AdminDashboard() {
  const router = useRouter()
  const searchParams:any = useSearchParams()
  const [open, setOpen] = useState(false)
  const [display, setDisplay] = useState<JSX.Element | null>(null);
  const [menu, setMenus] = useState(Menus);
  const [header, setHeader] = useState("");

  useEffect(() => {
    setHeader(searchParams.get("page"?.toString()) || "Dashboard")
  }, [])

  const handleItemClick = (index: number) => {
    const clickedItem = Menus[index];
    const updatedMenus = Menus.map((menu, i) => {
      return {
        ...menu,
        clicked: i === index,
      };
    });
    setHeader(clickedItem.title);
    setMenus(updatedMenus);
    router.push(`?page=${clickedItem.title}`)
  };

  return {
    handleItemClick,
    open,
    setOpen,
    display,
    setDisplay,
    header,
    menu,
  }
}
export default AdminDashboard
