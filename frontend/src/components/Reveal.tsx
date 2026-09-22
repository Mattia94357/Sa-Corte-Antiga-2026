import {motion} from 'framer-motion'; import type {PropsWithChildren} from 'react';
export function Reveal({children,className=''}:PropsWithChildren<{className?:string}>){return <motion.div className={className} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.16}} transition={{duration:.8,ease:[.2,.7,.2,1]}}>{children}</motion.div>}
