import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';

export const SidebarData = [
  {
    title: 'Home',
    path: '/transfer',
    icon: <BiIcons.BiTransfer />,
    cName: 'nav-text'
  },
  {
    title: 'Account',
    path: '/account',
    icon: <MdIcons.MdAccountCircle />,
    cName: 'nav-text'
  },
  {
    title: 'Manage Links',
    path: '/links',
    icon: <BiIcons.BiLinkAlt />,
    cName: 'nav-text'
  },
  {
    title: 'About',
    path: '/about',
    icon: <AiIcons.AiOutlineInfoCircle />,
    cName: 'nav-text'
  },
  {
   title: 'Logout',
   path: '/logout',
   cName: 'nav-text'
  }
];
