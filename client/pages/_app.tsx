import { FunctionComponent } from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import '@/styles/signup.css'
import Header from '@/components/Header'
import buildClient from '@/api/buildClient'
import axios from 'axios'
interface User {
  email: string; id: string
}
type currentUser = null | User
type App = {
  Component: any;
  pageProps: any;
  currentUser: currentUser
}


//@ts-ignore
const App: FunctionComponent<App> = ({ Component, currentUser, pageProps }) => {
  return <>
    <div className="">
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>

  </>

}
//@ts-ignore
App.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');


  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};
export default App