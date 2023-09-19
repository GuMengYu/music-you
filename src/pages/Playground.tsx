import useInForeground from "@/hooks/useInForeground";
import {useLocation, useMatch} from "react-router-dom";
import PageTransition from "@/components/PageTransition";

export default function Playground() {
  const location = useLocation()
  const match = useMatch('/playground')
  const {isActive, matches} = useInForeground('playground')
  return <PageTransition>
    <div className='flex flex-col gap-4'>
      {/*{isActive} { JSON.stringify(matches) }*/}
      <p>
        {JSON.stringify(matches)}

      </p>

      <p>
        {JSON.stringify(location)}

      </p>


      <p>
        {JSON.stringify(match)}

      </p>
    </div>
  </PageTransition>
}
