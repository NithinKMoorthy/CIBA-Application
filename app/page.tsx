import Image from "next/image";
import {getSession} from '@auth0/nextjs-auth0'
import NavBar from '@/components/home/navbar';
import Home from '@/components/home/home';
export default async function HomePage() {
  const session = await getSession();
  const user = session?.user;
  console.log(user);
  return (
    <div className="flex flex-grow" >
      <Home /> 
   </div>
  );
}
