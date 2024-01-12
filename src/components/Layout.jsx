import { Outlet } from "react-router-dom"


const Layout = () => {
    return (
        <main className="App">
        {/* header component */}
            <Outlet />
        {/* footer component */}
        </main>
    )
}

export default Layout
