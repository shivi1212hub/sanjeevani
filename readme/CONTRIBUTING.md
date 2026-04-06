# Contributing to Sanjeevani

Thank you for your interest in contributing! This document provides guidelines for contributing to the Sanjeevani project.

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/sanjeevani.git
cd sanjeevani
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-xyz` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/component-name` - Refactoring

### 3. Set Up Development Environment

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (in another terminal)
cd backend/supabase
npm install
supabase start
```

## Development Guidelines

### Code Style

- Use TypeScript
- Follow ESLint rules: `npm run lint`
- Format code with Prettier (configured)
- Write descriptive commit messages

### Commit Messages

Use conventional commits:

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
```

### Component Development

#### File Structure

```typescript
// src/components/MyComponent.tsx
import { FC } from 'react'

interface MyComponentProps {
  prop1: string
  prop2?: number
}

export const MyComponent: FC<MyComponentProps> = ({ prop1, prop2 }) => {
  return (
    <div>
      {prop1}
    </div>
  )
}
```

#### Best Practices

1. Use functional components with hooks
2. Destructure props in the function signature
3. Use TypeScript for type safety
4. Separate concerns (UI, logic, styling)
5. Use custom hooks for complex logic
6. Keep components small and focused

### Testing

Write tests for new features:

```typescript
// src/components/__tests__/MyComponent.test.ts
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent prop1="test" />)
    expect(getByText('test')).toBeInTheDocument()
  })
})
```

Run tests:
```bash
npm run test
npm run test:watch
```

### Documentation

Update documentation when:
- Adding new features
- Changing API
- Modifying project structure
- Breaking changes

## Pull Request Process

### Before Submitting

1. **Lint & Format**
   ```bash
   npm run lint
   ```

2. **Run Tests**
   ```bash
   npm run test
   ```

3. **Build Verification**
   ```bash
   npm run build
   ```

4. **Manual Testing**
   - Test on different browsers
   - Test on mobile devices
   - Test edge cases

### PR Title & Description

**Title Format:**
```
[TYPE] Brief description
```

Examples:
- `[FEATURE] Add emergency notification system`
- `[FIX] Resolve authentication timeout issue`
- `[DOCS] Update frontend setup guide`

**Description Template:**

```markdown
## Description
Short summary of changes

## Changes Made
- Change 1
- Change 2

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No regressions identified

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed the changes
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] Added tests where applicable
- [ ] All tests pass
- [ ] Build succeeds

## Code Review Process

1. At least one approval required
2. All CI checks must pass
3. No unresolved conversations
4. Squash commits before merging

## Issues

### Reporting Bugs

**Title:** `[BUG] Brief description`

**Template:**

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari
- Node version: 18.x

## Additional Context
Any additional information
```

### Feature Requests

**Title:** `[FEATURE] Brief description`

**Template:**

```markdown
## Description
Detailed description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How it should work

## Alternatives Considered
Other approaches
```

## Development Workflow

### Feature Development

1. Create feature branch
2. Develop feature with tests
3. Update documentation
4. Submit PR with description
5. Address review feedback
6. Merge after approval

### Bug Fixes

1. Understand root cause
2. Add failing test
3. Fix the bug
4. Verify test passes
5. Submit PR with fix

### Documentation Updates

1. Update relevant files
2. Check for broken links
3. Submit PR with changes

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH)

### Before Release

1. Update CHANGELOG.md
2. Bump version in package.json
3. Create release branch: `release/v1.x.x`
4. Create PR for review
5. After approval, tag and merge

## Communication

- **Issues**: For bug reports and features
- **Discussions**: For questions and ideas
- **Pull Requests**: For code changes

## Code of Conduct

### Be Respectful

- Treat everyone with respect
- Welcome diverse perspectives
- No harassment or discrimination

### Be Constructive

- Provide helpful feedback
- Offer suggestions and solutions
- Learn from mistakes

### Be Professional

- Keep discussions on topic
- Avoid inflammatory language
- Help others grow

## Questions?

- Check existing documentation
- Search open issues
- Create a discussion
- Ask in PR comments

## Recognition

Contributors will be acknowledged in:
- CONTRIBUTORS.md
- Release notes
- GitHub contributors page

## License

By contributing, you agree your contributions are licensed under the same license as the project.

---

Thank you for contributing to make Sanjeevani better! 🙏
