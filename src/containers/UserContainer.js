import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import User from "../components/User";
import { /*Preloader,*/ usePreloader } from "../lib/PreloadContext";
import { getUser } from "../modules/users";

const UserContainer = ({ id }) => {
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  // #. 서버 사이드 렌더링시 API 호출
  usePreloader(() => dispatch(getUser(id)));

  useEffect(() => {
    if (user && user.id === parseInt(id, 10)) return; // # 중복 호출 차단

    dispatch(getUser(id));
  }, [dispatch, id, user]);

  // #. usePreloader Hook 사용하여 Preloader 컴포넌트 대체. (Preloader 컴포넌트는 클래스형 컴포넌트에서 사용)
  if (!user) return null;
  /*if (!user) return <Preloader resolve={() => dispatch(getUser(id))} />;*/

  return <User user={user} />;
};

export default UserContainer;
