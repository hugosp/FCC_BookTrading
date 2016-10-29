import Base       from '../components/Base.jsx';
import Home       from '../components/Home.jsx';
import LoginForm  from '../components/LoginForm.jsx';
import SignUpForm from '../components/SignUpForm.jsx';
import Profile    from '../components/Profile.jsx';
import AllBooks   from '../components/AllBooks.jsx';
import Auth       from '../modules/Auth';

const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/profile',
      onEnter: requireAuth,
      component: Profile
    },
    {
      path: '/all',
      onEnter: requireAuth,
      component: AllBooks
    },
    {
      path: '/login',
      component: LoginForm
    },
    {
      path: '/signup',
      component: SignUpForm
    },
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        replace('/');
      }
    },
  ]
};



function requireAuth(nextState, replace){
	if(!Auth.isUserAuthenticated()){
		replace({
			pathname: '/login',
			state: {
				nextPathName: nextState.location.pathname
			}
		})
	}
}


export default routes;