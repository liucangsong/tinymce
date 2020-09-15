import { Arr, Fun } from '@ephox/katamari';
import { Attribute, Insert, InsertAll, Remove, Replication, SelectorFilter, SelectorFind, SugarElement, Traverse } from '@ephox/sugar';
import { Detail, DetailNew, RowDataNew, Section } from '../api/Structs';

const setIfNot = (element: SugarElement, property: string, value: number, ignore: number): void => {
  if (value === ignore) {
    Attribute.remove(element, property);
  } else {
    Attribute.set(element, property, value);
  }
};

interface NewRowsAndCells {
  readonly newRows: SugarElement[];
  readonly newCells: SugarElement[];
}

const render = <T extends DetailNew> (table: SugarElement, grid: RowDataNew<T>[]): NewRowsAndCells => {
  const newRows: SugarElement[] = [];
  const newCells: SugarElement[] = [];

  const insertThead = Arr.last(SelectorFilter.children(table, 'caption,colgroup')).fold(
    () => Fun.curry(Insert.prepend, table),
    (c) => Fun.curry(Insert.after, c)
  );

  const renderSection = (gridSection: RowDataNew<T>[], sectionName: Section) => {
    const section = SelectorFind.child(table, sectionName).getOrThunk(() => {
      const tb = SugarElement.fromTag(sectionName, Traverse.owner(table).dom);
      sectionName === 'thead' ? insertThead(tb) : Insert.append(table, tb); // mutation
      return tb;
    });

    Remove.empty(section);

    const rows = Arr.map(gridSection, (row) => {
      if (row.isNew) {
        newRows.push(row.element);
      }
      const tr = row.element;
      Remove.empty(tr);
      Arr.each(row.cells, (cell) => {
        if (cell.isNew) {
          newCells.push(cell.element);
        }
        setIfNot(cell.element, 'colspan', cell.colspan, 1);
        setIfNot(cell.element, 'rowspan', cell.rowspan, 1);
        Insert.append(tr, cell.element);
      });
      return tr;
    });

    if (sectionName !== 'colgroup') {
      InsertAll.append(section, rows);
    }
  };

  const removeSection = (sectionName: Section) => {
    SelectorFind.child(table, sectionName).each(Remove.remove);
  };

  const renderOrRemoveSection = (gridSection: RowDataNew<T>[], sectionName: Section) => {
    if (gridSection.length > 0) {
      renderSection(gridSection, sectionName);
    } else {
      removeSection(sectionName);
    }
  };

  const headSection: RowDataNew<T>[] = [];
  const bodySection: RowDataNew<T>[] = [];
  const footSection: RowDataNew<T>[] = [];
  const columnGroupsSection: RowDataNew<T>[] = [];

  Arr.each(grid, (row) => {
    switch (row.section) {
      case 'thead':
        headSection.push(row);
        break;
      case 'tbody':
        bodySection.push(row);
        break;
      case 'tfoot':
        footSection.push(row);
        break;
      case 'colgroup':
        columnGroupsSection.push(row);
        break;
    }
  });

  if (columnGroupsSection.length) {
    renderOrRemoveSection(columnGroupsSection, 'colgroup');
  }

  renderOrRemoveSection(headSection, 'thead');
  renderOrRemoveSection(bodySection, 'tbody');
  renderOrRemoveSection(footSection, 'tfoot');

  return {
    newRows,
    newCells
  };
};

const copy = <T extends Detail> (grid: RowDataNew<T>[]): SugarElement<HTMLTableRowElement>[] => Arr.map(grid, (row) => {
  // Shallow copy the row element
  const tr = Replication.shallow(row.element);
  Arr.each(row.cells, (cell) => {
    const clonedCell = Replication.deep(cell.element);
    setIfNot(clonedCell, 'colspan', cell.colspan, 1);
    setIfNot(clonedCell, 'rowspan', cell.rowspan, 1);
    Insert.append(tr, clonedCell);
  });
  return tr;
});

export {
  render,
  copy
};
