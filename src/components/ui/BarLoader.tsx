import { Variants, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
    initial: {
        scaleY: 0.5,
        opacity: 0,
    },
    animate: {
        scaleY: 1,
        opacity: 1,
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1,
            ease: "circIn",
        },
    },
} as Variants;

export const BarLoader = ({ className }: { className?: string }) => {
    return (
        <motion.div
            transition={{
                staggerChildren: 0.25,
            }}
            initial="initial"
            animate="animate"
            className={cn("flex gap-1", className)}
        >
            <motion.div variants={variants} className="h-12 w-2 bg-primary" />
            <motion.div variants={variants} className="h-12 w-2 bg-primary" />
            <motion.div variants={variants} className="h-12 w-2 bg-primary" />
            <motion.div variants={variants} className="h-12 w-2 bg-primary" />
            <motion.div variants={variants} className="h-12 w-2 bg-primary" />
        </motion.div>
    );
};
