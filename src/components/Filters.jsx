import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@nextui-org/react";

export default function Filters() {
  const genres = [
    { id: 1, title: "Personal Growth" },
    { id: 2, title: "True Crime and Investigative Journalism" },
    { id: 3, title: "History" },
    { id: 4, title: "Comedy" },
    { id: 5, title: "Entertainment" },
    { id: 6, title: "Business" },
    { id: 7, title: "Fiction" },
    { id: 8, title: "News" },
    { id: 9, title: "Kids and Family" },
  ];

  const sortingOptions = [
    { id: 1, title: "Newest" },
    { id: 2, title: "Oldest" },
    { id: 3, title: "A-Z" },
    { id: 4, title: "Z-A" },
  ];

  return (
    <div className="filters-container">
      <div className="filters-item-one">
        <Input
          className="search-bar"
          bordered
          clearable
          color="primary"
          placeholder="Search"
        />
        <Button className="favourites-button" color="primary" variant="shadow">
          Favourites
        </Button>
      </div>
      <div className="filters-item-two">
        <Dropdown className="genres">
          <DropdownTrigger>
            <Button color="default" variant="flat">
              Genres
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="genres" items={genres}>
            {(item) => <DropdownItem key={item.key}>{item.title}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
        <Dropdown className="sorting">
          <DropdownTrigger>
            <Button color="default" variant="flat">
              Sort
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="sort" items={sortingOptions}>
            {(item) => <DropdownItem key={item.key}>{item.title}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
