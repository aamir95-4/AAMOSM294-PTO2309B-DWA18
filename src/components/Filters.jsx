import { Select, SelectItem, Button, Input } from "@nextui-org/react";
import genres from "./api/genres";
import PropTypes from "prop-types";

export default function Filters({
  selectedGenres,
  setSelectedGenres,
  sortingOptions,
  setSortingOptions,
  searchTerm,
  setSearchTerm,
}) {
  const sortFilters = [
    { key: "A-Z", label: "A-Z" },
    { key: "Z-A", label: "Z-A" },
    { key: "Newest", label: "Newest" },
    { key: "Oldest", label: "Oldest" },
  ];

  const handleSortChange = (e) => {
    setSortingOptions(e.target.value);
  };

  return (
    <div className="filters-container">
      <div className="filters-search">
        <Input
          className="search-bar"
          bordered
          clearable
          color="primary"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filter-options">
        <Select
          className="genre-select"
          items={genres}
          label="Genres"
          selectionMode="multiple"
          aria-label="genres"
          size="sm"
          selectedKeys={selectedGenres}
          onSelectionChange={setSelectedGenres}
        >
          {(item) => <SelectItem key={item.id}>{item.title}</SelectItem>}
        </Select>

        <Select
          className="sorting-select"
          label="Sort"
          selectedKeys={[sortingOptions]}
          onChange={handleSortChange}
          aria-label="sort"
          size="sm"
          items={sortFilters}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        <Button
          color="default"
          variant="light"
          className="capitalize"
          onClick={() => {
            setSearchTerm("");
            setSelectedGenres([]);
            setSortingOptions("");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

Filters.propTypes = {
  selectedGenres: PropTypes.array,
  setSelectedGenres: PropTypes.func,
  sortingOptions: PropTypes.string,
  setSortingOptions: PropTypes.func,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};
