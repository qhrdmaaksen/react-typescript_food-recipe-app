import React, { useContext, useLayoutEffect, useState } from "react";
import { AuthenticationContext } from "../context";
import { MdOutlineClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { AUTH_TYPE } from "../@types";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Button } from "../components";

const routes = [
  { name: "Home", to: "/dashboard" },
  { name: "Add Recipe", to: "/dashboard/addrecipe" },
  { name: "My Recipes", to: "/dashboard/myrecipes" },
];

export const DashboardLayout = () => {
  // onLogout, loading 은 AuthenticationContext 에서 가져온다.
  const { onLogout, loading, user } = useContext(AuthenticationContext) as AUTH_TYPE;
  const navigate = useNavigate();
  // useParams 를 통해 현재 path 를 가져온다.
  const pathname = useLocation().pathname;
  // 렌더링 이후 로그인이 되어있지 않은 경우 landing page 로 이동한다.
  useLayoutEffect(() => {
    if (!sessionStorage.getItem("email") && !sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full h-full bg-black overflow-x-hidden">
      <div className="h-[60px] md:h-[80px] bg-zinc-900 flex items-center justify-between px-3 sticky top-0 z-50">
        <div className="flex items-center">
          <h2 className="text-white font-bold text-xl underline-offset-4 underline">
            <NavLink to="/dashboard">Foodie</NavLink>
          </h2>
          <span className="text-orange-700 font-extrabold text-xl pl-2">.</span>
        </div>

        {/* menu bar isOpen 이 TRUE 면 X 아이콘, FALSE 면 메뉴 목록 아이콘*/}
        <div className="text-white md:hidden">
          {isOpen ? (
            <MdOutlineClose onClick={handleIsOpen} />
          ) : (
            <FiMenu onClick={handleIsOpen} />
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full h-full z-10 relative">
        <div className="hidden md:block bg-zinc-900 h-full w-[20%] fixed">
          <div className="md:flex gap-8 items-start w-full p-3">
            <img
              className="h-16 w-16 object-cover rounded-full"
              src="https://images.unsplash.com/photo-1612766959025-ac18e2b3bb96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              alt="A image"
            />
            <div>
              <p className="text-orange-500 font-light">{user}</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 mt-3">
            {routes.map(({ name, to }) => (
              <NavLink
                key={name + to}
                to={to}
                className={({ isActive }) =>
                  isActive && pathname === to
                    ? "text-white font-thin text-sm bg-orange-500 p-4"
                    : "text-white font-thin text-sm hover:bg-orange-500 p-4"
                }
              >
                {name}
              </NavLink>
            ))}
            <Button
              title="Logout"
              handleClick={onLogout}
              className="text-white font-thin text-sm text-left hover:bg-orange-500 p-4"
            />
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg:zinc-800 w-full h-full top-0 absolute md:relative">
            <div className="flex gap-8 items-start w-full p-3">
              <img
                className="w-10 h-10 rounded-3xl"
                src="https://images.unsplash.com/photo-1612766959025-ac18e2b3bb96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="User"
              />
              <div>
                <p className="text-orange-700 font-light">krman@gmail.com</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-1 mt-3">
              {routes.map(({ name, to }) => (
                <NavLink
                  key={name + to}
                  to={to}
                  onClick={handleIsOpen}
                  className={({ isActive }) =>
                    isActive && pathname === to
                      ? "text-white font-thin text-sm bg-orange-500 p-4"
                      : "text-white font-thin text-sm hover:bg-orange-500 p-4"
                  }
                >
                  {name}
                </NavLink>
              ))}
              <Button
                title='Logout'
                handleClick={onLogout}
                className='text-white font-thin text-sm text-left hover:bg-orange-500 p-4'
              />
            </div>
          </div>
        )}
        <div className='md:w-[80%] p-3 md:px-8 md:py-6 w-full h-full md:ml-[16rem]'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
