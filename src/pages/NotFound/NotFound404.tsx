import logo_e_guard from '../../images/logo/logo_e_guard.svg';
import illustration from '../../images/icon/illustration-04.svg';

function NotFound404() {
  return (
    <div className="grid-row no-scrollbar grid h-screen overflow-y-hidden bg-white text-center">
      <div className="grid h-15 items-center justify-center bg-gradient-to-r from-eguard-green to-eguard-darkgreen">
        <img className="px-3 py-4" src={logo_e_guard} alt="Logo" />
      </div>
      <div className="flex justify-center">
        <div className="text-center">
          <span className="inline-block">
            <img src={illustration} alt="illustration" />
          </span>
        </div>
      </div>
      <div>
        <h2 className="text-[50px] font-black leading-[60px] text-black">
          404 Not Found
        </h2>
        <p className="font-medium">
          페이지를 찾을 수 없습니다. 다른 url을 입력하세요.
        </p>
      </div>
    </div>
  );
}

export default NotFound404;
