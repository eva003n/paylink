import React from 'react'
import { NavLink } from 'react-router-dom'
import {WalletCards} from "lucide-react"

const Header = () => {
  return (
    <header className="flex px-12 py-2">
      <div className="flex grow gap-1 font-bold text-violet-500">
        <WalletCards size={24} />
        <p className="text-lg">Paylink</p>
      </div>
      <nav className="flex grow">
        <ul className="flex grow justify-between">
          <div className="flex gap-4">
            <li>
              <NavLink to={"/payment/link/create"} end>
                Create
              </NavLink>
            </li>
            <li>
              <NavLink to={"/payment/status"} end>
                Checkout
              </NavLink>
            </li>
            <li>
              <NavLink to={"/payments/checkout"} end></NavLink>
            </li>
          </div>
          <div className="flex gap-4">
            <li>
              <NavLink to={"/sign-in"} end>
                Sign in
              </NavLink>
            </li>
            <li className="">
              <NavLink to={"/sign-up"} end>
                Sign up
              </NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Header