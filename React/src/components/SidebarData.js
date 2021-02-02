import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as MdIcons from 'react-icons/md';

export const SidebarData = [
  {
    title: 'Przesył P2P',
    path: '/p2p',
    icon: <BiIcons.BiTransfer />,
    cName: 'nav-text'
  },
  {
    title: 'Wstaw pliki',
    path: '/upload',
    icon: <AiIcons.AiOutlineCloudUpload />,
    cName: 'nav-text'
  },
  {
    title: 'Konto',
    path: '/account',
    icon: <MdIcons.MdAccountCircle />,
    cName: 'nav-text'
  },
  {
    title: 'Udostępnianie',
    path: '/links',
    icon: <BiIcons.BiLinkAlt />,
    cName: 'nav-text'
  },
  {
    title: 'O nas',
    path: '/about',
    icon: <AiIcons.AiOutlineInfoCircle />,
    cName: 'nav-text'
  },
  {
   title: 'Wyloguj',
   path: '/logout',
   cName: 'nav-text'
  }
];
