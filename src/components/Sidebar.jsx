function Sidebar({ menus }) {

  return (
    <div>
      <h2>Menus</h2>
      {menus.map((menu) => (
        <p>{menu.menu}</p>
      ))}
    </div>
  );
}

export default Sidebar;
