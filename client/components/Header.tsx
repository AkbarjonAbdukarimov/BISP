import Link from "next/link"
//@ts-ignore
const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/users/signup' },
        !currentUser && { label: 'Sign In', href: '/users/signin' },

        currentUser && { label: 'Sign Out', href: '/users/signout' },
    ]
        .filter((linkConfig) => linkConfig)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href}>
                        <span className="nav-link">{label}</span>
                    </Link>
                </li>
            );
        });


    return <> <nav className="navbar container  px-3">
        <Link href="/">
            <span className="navbar-brand">Manzil.uz</span>
        </Link>

        <div className="d-flex justify-content-end">
            <ul className="nav d-flex align-items-center">{links}</ul>
        </div>
    </nav></>

}
export default Header