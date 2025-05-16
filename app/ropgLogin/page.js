import Image from "next/image";
import {getSession} from '@auth0/nextjs-auth0'
import NavBar from '@/components/home/navbar';
import ROPGHome from '@/components/home/ropgLoginHome';
export default async function ROPGLogin() {
//   console.log(user);
  return (
    <div className="flex flex-grow flex-col bg-[url('/banking-test.webp')] bg-cover ml-['40px']" >
      {/* <NavBar />  */}
      <ROPGHome /> 
      
   </div>
  );
}
