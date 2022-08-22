import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { TeamOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Image from 'next/image';
import 'antd/dist/antd.css'
import s from '../styles/sidebar.module.scss'
import { useState } from 'react';
import { FaDiscord } from 'react-icons/fa'

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }                             

const items: MenuProps['items'] = [
        getItem('Members','1', <TeamOutlined />, [
            getItem('Your Profile','2'),
            getItem('All Members', '3'),
        ], 'group'),
        getItem('Governance','4',<ScheduleOutlined />, [
            getItem('Vote on Proposals','5'),
            getItem('Create Proposals','6'),
        ],'group'),
]

export const FixedSidebar = () => {

    const router = useRouter();

    const [menumode, setMenumode] = useState<'vertical' | 'inline'>('inline')

    const onClick: MenuProps['onClick'] = e => {
        console.log(e)
        if(e.key === '2') router.push('/profile')
        else if(e.key === '3') router.push('/members')
        else if(e.key === '5') router.push('/proposals')
        else if(e.key === '6') router.push('/create')
    };

  return (
    <Sider
    style={{
      backgroundColor:'#1A1C21',
      height: '100vh',
      left: 0,
      top: 0,
      bottom: 0,
    }}
  >
    <img className={s.logo} onClick={() => router.push('/')} src={'/../app-logo.svg'} alt="Weavechain Logo" width='180' height='100' style={{marginTop: -16}}/>
    <Menu style={{marginTop: '23vh'}} onClick={onClick} theme='dark' mode='inline' items={items} />
    <div className={s.navlogos} style={{marginTop: '23vh', display:'flex', justifyContent:'space-around'}}>
      <FaDiscord onClick={() => {}} style={{width: 50, height: 50}} />
    </div>

  </Sider>
  )
}
