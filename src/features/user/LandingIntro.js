function LandingIntro() {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <h1 className="text-3xl text-center font-bold ">
            <img
              src="/logo.png"
              className="w-12 inline-block mr-2 mask mask-circle"
              alt="dashwind-logo"
            />
            Expense Manager
          </h1>

          <div className="text-center mt-12">
            <img
              src="./landing_svg.svg"
              alt="Landing SVG"
              className="w-52 inline-block"
            ></img>
          </div>

          {/* APP Points */}
          <h1 className="text-2xl mt-8 font-bold">Expense Manager</h1>
          <p className="py-2 mt-4">
            ✓ <span className="font-semibold">People Management</span>
          </p>
          <p className="py-2 ">
            ✓ <span className="font-semibold">Project Management</span>
          </p>
          <p className="py-2">
            ✓ <span className="font-semibold">Expense/Income Mangement </span>
          </p>
          <p className="py-2  ">
            ✓ <span className="font-semibold">User-friendly</span>
          </p>
          <p className="py-2  mb-4">
            ✓ <span className="font-semibold">Reports And Analytics</span>,{" "}
            <span className="font-semibold">Email</span> support
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
