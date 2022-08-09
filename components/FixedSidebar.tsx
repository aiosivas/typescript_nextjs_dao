import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { TeamOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Image from 'next/image';
import 'antd/dist/antd.css'
import style from '../styles/sidebar.module.css'

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

    const onClick: MenuProps['onClick'] = e => {
        console.log(e)
        if(e.key === '2') router.push('/profile')
        else if(e.key === '3') router.push('/members')
        else if(e.key === '5') router.push('/vote')
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
    <div style={{marginTop: '30vh', textAlign:'center', cursor:'pointer'}} className={style.logo} onClick={() => {
      router.push('/')
    }}><h1>Navigation</h1></div>
    <Menu onClick={onClick} theme='dark' mode='inline' items={items} />
  </Sider>
  )
}
