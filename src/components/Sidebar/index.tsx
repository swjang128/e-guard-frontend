import React, { Children, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import logo_e_guard from '../../images/logo/logo_e_guard.svg';
import atemos_logo from '../../images/logo/main_logo_wh_width.png';
import icon_facility from '../../images/icon/icon-facility.png';
import { useRecoilState } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import queries from '../../hooks/queries/queries';
import { E_ROLE_TYPES } from '../../enum';
import { usableMenusState } from '../../store/usableMenusAtom';
import { MenuEntity, UsableMenuEntity } from '../../types/MenuEntity';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const { useMenuList } = queries();
  const { data: menuListData } = useMenuList();

  const [usableMenus, setUsableMenus] =
    useRecoilState<UsableMenuEntity>(usableMenusState);
  const [userAccessibleMenus, setUserAccessibleMenus] = useState<
    UsableMenuEntity[]
  >([]);

  // menuList Setting
  useEffect(() => {
    if (menuListData && loggedInUser?.accessibleMenuIds) {
      const accessibleMenuIds = loggedInUser?.accessibleMenuIds;
      const filteredMenuListData = menuListData
        .map((menu: MenuEntity) => {
          if (
            menu.menuId !== 1 &&
            menu.menuId !== 2 &&
            accessibleMenuIds.includes(menu.menuId)
          ) {
            return {
              ...menu,
              children:
                menu.children &&
                menu.children.filter(
                  (children) =>
                    children.accessibleRoles.includes(loggedInUser.role) &&
                    accessibleMenuIds.includes(children.menuId)
                ),
            };
          }
        })
        .filter((menu: MenuEntity) => menu !== undefined);
      setUserAccessibleMenus(filteredMenuListData);

      // filteredMenuListData를 usableMenus RecoilVaue와 sessionStorage에도 셋팅
      setUsableMenus(filteredMenuListData);
    }
  }, [menuListData, loggedInUser, setUserAccessibleMenus]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`... absolute left-0 top-0 z-9999 flex h-screen w-70 flex-col overflow-y-hidden bg-gradient-to-b from-eguard-sidebar-start to-eguard-sidebar-end duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-10 py-6">
        <NavLink to="/">
          <img src={logo_e_guard} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup activeCondition={true}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {userAccessibleMenus &&
                        userAccessibleMenus.map((menu) => (
                          <>
                            <NavLink
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-eguard-sidebar-end dark:hover:bg-meta-4`}
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <p className="w-5">
                                <img
                                  src={icon_facility}
                                  alt=""
                                  className="w-[21px]"
                                />
                              </p>
                              {menu.menuName}
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && 'rotate-180'
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </NavLink>
                            <div
                              className={`translate transform overflow-hidden ${
                                !open && 'hidden'
                              }`}
                            >
                              <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                {menu.children &&
                                  menu.children.map(
                                    (childrenMenu) => (
                                      <li>
                                        <NavLink
                                          to={childrenMenu.menuUrl}
                                          className={({ isActive }) =>
                                            'group relative flex items-center gap-2.5 rounded-md px-5.5 font-medium text-eguard-darktext duration-300 ease-in-out hover:text-white ' +
                                            (isActive && '!text-white')
                                          }
                                        >
                                          {childrenMenu.menuName}
                                        </NavLink>
                                      </li>
                                    )
                                    // <li>
                                    //   <NavLink
                                    //     to="/management/work"
                                    //     className={({ isActive }) =>
                                    //       'group relative flex items-center gap-2.5 rounded-md px-5.5 font-medium text-eguard-darktext duration-300 ease-in-out hover:text-white ' +
                                    //       (isActive && '!text-white')
                                    //     }
                                    //   >
                                    //     작업 관리
                                    //   </NavLink>
                                    // </li>
                                    // <li>
                                    //   <NavLink
                                    //     to="/management/employee"
                                    //     className={({ isActive }) =>
                                    //       'group relative flex items-center gap-2.5 rounded-md px-5.5 font-medium text-eguard-darktext duration-300 ease-in-out hover:text-white ' +
                                    //       (isActive && '!text-white')
                                    //     }
                                    //   >
                                    //     근로자 관리
                                    //   </NavLink>
                                    // </li>
                                  )}
                              </ul>
                            </div>
                          </>
                        ))}
                      {/* <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-eguard-sidebar-end dark:hover:bg-meta-4`}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className="w-5">
                          <img
                            src={icon_facility}
                            alt=""
                            className="w-[21px]"
                          />
                        </p>
                        사건
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/event/area"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-5.5 font-medium text-eguard-darktext duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              구역 사건
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/event/employee"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-5.5 font-medium text-eguard-darktext duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              근로자 사건
                            </NavLink>
                          </li>
                        </ul>
                      </div> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </nav>
      </div>

      {/* contact */}
      <div className="absolute bottom-0 left-0 bg-transparent px-10 py-6 text-white">
        {/* <img src={icon_contact} alt="logo" className="w-10" /> */}
        <img src={atemos_logo} alt="logo" className="mb-0.5 w-20" />
        <p className="text-[12px] font-extralight">
          © 2024 Atemos. All rights reserved.
        </p>
      </div>
      {/* contact */}
    </aside>
  );
};

export default Sidebar;
