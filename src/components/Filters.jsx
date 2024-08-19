import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@nextui-org/react";
import genres from "./api/genres";

export default function Filters({
  selectedGenres,
  setSelectedGenres,
  sortingOptions,
  setSortingOptions,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="filters-container">
      <div className="filters-item-one">
        <Input
          className="search-bar"
          bordered
          clearable
          color="primary"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="favourites-button" color="primary" variant="shadow">
          Favourites
        </Button>
      </div>
      <div className="filters-item-two">
        <Dropdown className="genres">
          <DropdownTrigger>
            <Button color="default" variant="bordered">
              Genres
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="genres"
            selectionMode="multiple"
            items={genres}
            closeOnSelect={false}
            selectedKeys={selectedGenres}
            onSelectionChange={setSelectedGenres}
          >
            {(item) => <DropdownItem key={+item.id}>{item.title}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>

        <Dropdown className="sorting">
          <DropdownTrigger>
            <Button color="default" variant="bordered" className="capitalize">
              Sort
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="sorting selection"
            variant="flat"
            selectionMode="single"
            selectedKeys={sortingOptions}
            onSelectionChange={setSortingOptions}
          >
            <DropdownItem key="A-Z">A-Z</DropdownItem>
            <DropdownItem key="Z-A">Z-A</DropdownItem>
            <DropdownItem key="Newest">Newest</DropdownItem>
            <DropdownItem key="Oldest">Oldest</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
