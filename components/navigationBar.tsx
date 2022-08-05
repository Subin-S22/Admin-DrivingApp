import React from 'react';
import { sidebarRoute } from '../utils/helpers';
import { useRouter } from 'next/router';

const sideBar = ['Home', 'Customers', 'Trainers', 'Sessions'];
function NavigationBar() {
  const navigate = useRouter();
  return (
    <section className="h-max p-4 bg-gray-100 ">
      <ul className="flex gap-2 rounded-md justify-center flex-wrap">
        {sideBar.map((name: string, index: number) => {
          return (
            <li
              className="p-2 rounded-md text-md md:text-lg"
              key={index}
              onClick={() => sidebarRoute(name, navigate)}
            >
              <button className="btn bounce">{name}</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default NavigationBar;
