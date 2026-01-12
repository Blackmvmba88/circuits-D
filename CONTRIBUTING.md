# Contributing to Circuits Lab

Thank you for your interest in contributing to Circuits Lab! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to see if it has already been reported
2. **Open a new issue** with a clear title and description
3. **Include relevant details**:
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, version)

### Proposing New Features

We welcome feature proposals! Before implementing:

1. **Open an issue** to discuss the feature
2. **Describe the use case** and why it's valuable
3. **Consider the scope** - does it align with the project goals?
4. **Wait for feedback** from maintainers before starting work

### Adding Components or Personas

To add a new component type or persona:

1. **Component Types**:
   - Add to the component type options in `ComponentPropertiesPanel.tsx`
   - Add to the type select in `CircuitBuilder.tsx`
   - Consider adding 3D model variations in future

2. **Personas**:
   - Follow the existing persona structure in `mockData.ts`
   - Include: name, role, avatar (emoji), description
   - Keep personas focused on specific expertise areas

### Submitting Pull Requests

1. **Fork the repository** and create a new branch
2. **Follow the code style**:
   - Use TypeScript strict mode
   - Follow existing naming conventions
   - Keep components modular and reusable
   - Add type definitions for new interfaces
3. **Test your changes**:
   - Run `npm run lint` to check for linting errors
   - Run `npm run build` to ensure it compiles
   - Test in the browser with `npm run dev`
4. **Write clear commit messages**:
   - Use present tense ("Add feature" not "Added feature")
   - Be descriptive but concise
   - Reference related issues
5. **Update documentation** if needed:
   - Update README.md for new features
   - Update ROADMAP.md if completing roadmap items
   - Add inline comments for complex logic
6. **Submit the PR**:
   - Provide a clear description of what changed and why
   - Link to related issues
   - Include screenshots for UI changes

## Development Guidelines

### Project Structure

```
src/
├── components/     # React components (keep focused and reusable)
├── data/          # Mock data and initial state
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── App.tsx        # Main application component
└── App.css        # Application styles
```

### Type Safety

- **Always use TypeScript types** - no `any` types
- **Define interfaces** in `src/types/index.ts`
- **Export types** for use in components
- **Use strict mode** configuration

### Component Guidelines

- **Keep components focused** - single responsibility
- **Use props for data** - avoid prop drilling with context when needed
- **Handle state locally** when possible
- **Lift state up** to App.tsx for shared state
- **Use hooks** for side effects and state management

### Styling

- **Use the existing CSS** patterns in `App.css`
- **Follow naming conventions**: `.component-name`, `.component-name-element`
- **Keep styles scoped** to components
- **Use CSS variables** for colors and common values (consider adding)
- **Ensure responsive design** where applicable

### State Management

- **AppState** is persisted to localStorage via `useAppState` hook
- **Add new state fields** to `AppState` interface in `types/index.ts`
- **Update mock data** in `mockData.ts` to include new fields
- **Consider backwards compatibility** when changing state shape

## Code Review Process

1. Maintainers will review PRs within a few days
2. Address feedback and update your PR
3. Once approved, maintainers will merge your changes
4. Your contribution will be credited in the commit history

## Questions?

If you have questions about contributing:

- **Open a discussion** in GitHub Discussions
- **Ask in an issue** if it relates to existing work
- **Check existing documentation** in README and ROADMAP

## License

By contributing to Circuits Lab, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing!** 🎉
