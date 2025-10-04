import Link from "next/link";

type MenuButtonProps = {
    href: string;
    label: string;
};

export default function MenuButton({ href, label }: MenuButtonProps) {
    return (
        <Link
            href={href}
            className="menu-button inline-block bg-blue-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-600 transision duration-300 text-center"
        > 
            {label}
        </Link>
    );
}