import Image from "next/image";
import {getSession} from '@auth0/nextjs-auth0'
import NavBar from '@/components/home/navbar';
import Home from '@/components/home/home';
export default async function ROPGLogin() {
//   console.log(user);
  return (
    <div className="flex flex-grow flex-col" >
      <NavBar /> 
      <Home /> 
   </div>
  );
}
