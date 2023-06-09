import recipeOne from "../../assets/recipe-one.jpg";
import { Form, Input, Button } from "../../components";
import {FormEvent, useContext, useLayoutEffect, useState} from "react";
import { AUTH_TYPE, IPAYLOAD } from "../../@types";
import { validateEmail } from "../../utils";
import { AuthenticationContext } from "../../context";
import cogoToast from "cogo-toast";
import {useNavigate} from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate()

  // useLayoutEffect는 useEffect와 비슷하지만, 렌더링 결과가 돔에 반영된 직후에 동기적으로 호출된다는 점이 다르다.
  useLayoutEffect(() => {
    // sessionStorage에 token과 email이 있으면 dashboard로 이동한다.
    // 로그인이 되어있는 상태에서는 로그인 페이지로 이동하지 않도록 한다.
    if(
        !!sessionStorage.getItem("token") &&
        !!sessionStorage.getItem("email")
    ) {
      navigate("/dashboard")
    }
  })

  // AuthenticationContext에서 loading과 onLogin을 가져온다.
  const { loading, onLogin } = useContext(AuthenticationContext) as AUTH_TYPE;
  // state를 선언하고 초기값을 설정한다.
  const [state, setState] = useState<IPAYLOAD>({ email: "", password: "" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 이메일 유효성 검사
    if (!validateEmail(state?.email)) {
      return cogoToast.error("잘못된 이메일 주소입니다.");
    }
    if (!state?.password || state?.password.length < 7) {
      return cogoToast.error("비밀번호를 입력하십시오.");
    }
    await onLogin(state);
  };

  const handleState = (e: FormEvent<HTMLInputElement>) => {
    // e.currentTarget은 현재 이벤트가 발생한 요소를 가리킨다.
    const { name, value } = e.currentTarget;
    setState({ ...state, [name]: value });
  };

  return (
    <div className="container bg-black text-white h-[100%] flex flex-col-reverse md:flex-row w-full">
      <div className="w-full h-full">
        <Form
          className="flex items-center justify-center w-full h-full p-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2 w-full md:w-[50%]">
            <h2 className="text-orange-500 front-extrabold text-xl underline underline-offset-4">
              Foodie
            </h2>

            <Input
              name="email"
              type="text"
              placeholder="Email"
              handleChange={handleState}
              className={`bg-zinc-900 py-1 px-4 w-full shadow-xl placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none`}
              disabled={loading}
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              handleChange={handleState}
              className={`bg-zinc-900 py-1 px-4 w-full placeholder:text-sm hover:bg-zinc-800 cursor-pointer focus:outline-none`}
              disabled={loading}
            />

            <div className="w-full md:w-[50%] m-auto flex flex-col gap-2">
              <Button
                title={loading ? "loading..." : "Login"}
                type="submit"
                className={`bg-orange-500 text-white hover:bg-orange-600 py-1 px-6 w-full`}
                disabled={loading}
              />
            </div>
          </div>
        </Form>
      </div>
      <div className="w-full h-full saturate-200">
        <img
          src={recipeOne}
          alt="음식 레시피가 있는 요리"
          className="w-full h-full object-center object-cover"
        />
      </div>
    </div>
  );
};
