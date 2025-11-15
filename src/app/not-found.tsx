'use client'
import { Button, Image, Link } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <main className="bl_page404">
      <h1>Error 404. The page does not exist</h1>

      <p>
        Sorry! The page you are looking for cannot be found. Perhaps the page
        you requested was moved or deleted. It is also possible that you made a
        small typo when entering the address. Go to the main page.
      </p>

      <div className="bl_page404__wrapper">
        <Image
          src="https://github.com/BlackStar1991/Pictures-for-sharing-/blob/master/404/bigBoom/cloud_warmcasino.png?raw=true"
          alt="404 cloud"
          className="bl_page404__img"
        />

        <div className="bl_page404__el1"></div>
        <div className="bl_page404__el2"></div>
        <div className="bl_page404__el3"></div>

        <Link className="bl_page404__link" href="/dashboard" color="white">
          <Button>Go Home</Button>
        </Link>
      </div>

      <style jsx>{`
        body {
          width: 100%;
          margin: 0;
          height: 100%;
          background-color: #1d3041;
        }

        .bl_page404 {
          width: 100%;
          min-height: 100vh;
          background-color: #1d3041;
          color: #fff;
          font-family: "Open Sans", sans-serif;
          padding: 40px 20px;
          text-align: center;
        }

        h1 {
          margin-top: 1%;
          margin-bottom: 25px;
          font-size: 30px;
          font-weight: 400;
          text-transform: uppercase;
        }

        p {
          margin: 25px auto;
          max-width: 776px;
          color: #bcecf2;
          font-size: 16px;
          line-height: 24px;
        }

        .bl_page404__wrapper {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 30px auto;
          min-height: 410px;
        }

        .bl_page404__img {
          width: 100%;
        }

        .bl_page404__link {
          display: block;
          margin: 20px auto;
          width: 260px;
          height: 64px;
          box-shadow: 0 5px 0 #9c1007, inset 0 0 18px rgba(253, 60, 0, 0.75);
          background-color: #f95801;
          color: #fff;
          font-size: 24px;
          font-weight: 700;
          line-height: 64px;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 30px;
          text-align: center;
        }

        .bl_page404__link:hover {
          background-color: #ff7400;
        }

        /* Animated elements */
        .bl_page404__el1,
        .bl_page404__el2,
        .bl_page404__el3 {
          position: absolute;
          opacity: 1;
          z-index: 2;
        }

        .bl_page404__el1 {
          top: 108px;
          left: 102px;
          width: 84px;
          height: 106px;
          animation: el1Move 800ms linear infinite;
          background: url("https://github.com/BlackStar1991/Pictures-for-sharing-/blob/master/404/bigBoom/404-1.png?raw=true")
            50% 50% no-repeat;
        }

        .bl_page404__el2 {
          top: 92px;
          left: 136px;
          width: 184px;
          height: 106px;
          animation: el2Move 800ms linear infinite;
          background: url("https://github.com/BlackStar1991/Pictures-for-sharing-/blob/master/404/bigBoom/404-2.png?raw=true")
            50% 50% no-repeat;
        }

        .bl_page404__el3 {
          top: 108px;
          left: 180px;
          width: 284px;
          height: 106px;
          animation: el3Move 800ms linear infinite;
          background: url("https://github.com/BlackStar1991/Pictures-for-sharing-/blob/master/404/bigBoom/404-3.png?raw=true")
            50% 50% no-repeat;
        }

        @keyframes el1Move {
          0% {
            top: 108px;
            left: 102px;
            opacity: 1;
          }
          100% {
            top: -10px;
            left: 22px;
            opacity: 0;
          }
        }

        @keyframes el2Move {
          0% {
            top: 92px;
            left: 136px;
            opacity: 1;
          }
          100% {
            top: -10px;
            left: 108px;
            opacity: 0;
          }
        }

        @keyframes el3Move {
          0% {
            top: 108px;
            left: 180px;
            opacity: 1;
          }
          100% {
            top: 28px;
            left: 276px;
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
